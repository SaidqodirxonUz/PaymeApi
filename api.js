const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

app.get("/api", (req, res) => {
  const act = req.query.action;
  const sum = req.query.sum;
  const id = req.query.id;
  const myCard = req.query.card;
  const back = req.query.back;
  const desc = req.query.desc;

  if (act === "create") {
    const headers = {
      device: "6Fk1rB",
      "user-agent": "Mozilla/57.36",
    };

    const sum1 = sum * 100;

    axios
      .post(
        "https://payme.uz/api/p2p.create",
        {
          method: "p2p.create",
          params: {
            card_id: myCard,
            amount: sum1,
            description: desc,
          },
        },
        { headers }
      )
      .then((response) => {
        const result = response.data.result;
        const csv = {
          _id: result.cheque._id,
          _url: "https://checkout.paycom.uz",
          _pay_amount: sum + " UZS",
          _pay_url: "https://checkout.paycom.uz/" + result.cheque._id,
        };

        const ec = {
          _details: csv,
        };

        const ec2 = {
          _result: ec,
        };

        res.json(csv);
      })
      .catch((error) => {
        res.status(500).json({ error: "An error occurred" });
      });
  }

  if (act === "info") {
    axios
      .post("https://payme.uz/api/cheque.get", {
        method: "cheque.get",
        params: {
          id: id,
        },
      })
      .then((response) => {
        const result = response.data.result;
        const ok = result.cheque.pay_time;
        const t = ok ? "successfully" : "unsuccessfully";

        const ec = {
          mess: t,
        };

        res.json(ec);
      })
      .catch((error) => {
        res.status(500).json({ error: "An error occurred" });
      });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
