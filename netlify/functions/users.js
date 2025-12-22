const supabase = require("./db");

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return response(405, { error: "Method Not Allowed" });
  }

  const { data, error } = await supabase
    .from("users")
    .select("*");

  if (error) {
    return response(500, { error: error.message });
  }

  return response(200, data);
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(body)
  };
}
