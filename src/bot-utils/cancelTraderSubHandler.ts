export async function cancelTraderSub() {

  const baseUrl = process.env.TRADING_API_URL || "http://localhost:3000";
  const url = `${baseUrl}/cancel-subscription`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error making request:", error);
  }
}
