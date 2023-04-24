const Joi = require("joi");
const ValidateNewAkoamLink = {
    body:Joi.object({
        link: Joi.string().required().trim().uri().message("اللينك ده مش لينك اكوام الجديد")
    })
}
const ValidateOldAkoamLink = {
    body:Joi.object({
        link: Joi.string().required().trim().uri().regex(/\bold\b/).message("اللينك ده مش لينك اكوام القديم")
    })
}
module.exports = {
    ValidateNewAkoamLink,
    ValidateOldAkoamLink
};
