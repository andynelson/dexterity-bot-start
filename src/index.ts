import { Wallet } from "@coral-xyz/anchor";
import dexterity from "@hxronetwork/dexterity-ts";
import { Keypair, PublicKey } from "@solana/web3.js";
import { decode } from "bs58";
import {
  handleCancelSubscription,
  handleNewSubscription,
} from "./api-utils/subscritionHandler";

const AppState = new Map<string, any>();

export const app = async () => {
  const keypair = Keypair.fromSecretKey(decode(process.env.PRIVATE_KEY));
  const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
  const wallet = new Wallet(keypair);
  const rpc = "https://devnet.helius-rpc.com/?api-key=" + HELIUS_API_KEY;

  const manifest = await dexterity.getManifest(rpc, true, wallet);

  const trg = new PublicKey("6fZ8iqKHxPDYjkFNNWTYSs2KzeGigQPR3et2NkauahoW");
  const trader = new dexterity.Trader(manifest, trg);

  const server = Bun.serve({
    async fetch(req, server) {
      const url = new URL(req.url);
      const { pathname, searchParams } = url;

      let response: Response | undefined = new Response(
        JSON.stringify({ status: 200 })
      );

      switch (pathname) {
        case "/process-trade":
          break;
        case "/new-subscription":
          response = await handleNewSubscription(trader, manifest, searchParams.get("trg"), AppState)
          break;
        case "/cancel-subscription":
          response = await handleCancelSubscription(AppState)
        break;
          break;
        default:
          break;
      }

      if (!response) return new Response(JSON.stringify({ status: 200 }));
      return response;
    },
  });
  console.log(`${server.url}`);
};
