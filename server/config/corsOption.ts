module.exports = {
  origin: [
    `https://${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}`,
    `https://localhost:${process.env.CLIENT_PORT}`,
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};
