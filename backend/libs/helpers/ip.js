const ipInfo = require("ipinfo");

exports.get_ip_info = async (req) => {
  const user_ip = parseIp(req);
  try {
    const info = ipInfo(user_ip);

    return info;
  } catch (error) {
    return null;
  }
};

const parseIp = (req) =>
  req.headers["x-forwarded-for"]?.split(",").shift() ||
  req.socket?.remoteAddress;
