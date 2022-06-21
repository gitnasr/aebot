const Joi = require('joi');

const ArabseedLinkValidator = {
    body: Joi.object({
        link: Joi.string().required().trim().uri().regex(/^.*?\barabseed\b.*?\bselary\b.*?$/).message("خلي بالك، ده مش لينك المسلسل، ده غالبا لينك حلقه. مطلوب منك تجيب لينك المسلسل مش لينك حلقة"),
    })
}

const ArabseedOperationValidator = {
    body: {
        id: Joi.string().required().trim().alphanum().message("ليه كدا يغالي؟"),

        quality:Joi.number().optional().default(1).max(4)

    }
}

module.exports ={
    ArabseedLinkValidator,
    ArabseedOperationValidator
}