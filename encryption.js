var crypto = require('crypto');

module.exports = {
	hash : function(text) {
		return crypto.createHmac("md5", "0u812").update(text).digest("hex");
	},

	encrypt: function(text) {
		var cipher = crypto.createCipheriv("aes-256-gcm", "3zTvzr3p67VC61jmV54rIYu1545x4TlY", "60iP0h6vJoEa")
		var encrypted = cipher.update(text, 'utf8', 'hex')
		encrypted += cipher.final('hex');
		var tag = cipher.getAuthTag();
		return {
			content: encrypted,
			tag: tag
		};
	},

	decrypt: function(encrypted) {
		var decipher = crypto.createDecipheriv("aes-256-gcm", "3zTvzr3p67VC61jmV54rIYu1545x4TlY", "60iP0h6vJoEa")
		decipher.setAuthTag(encrypted.tag);
		var dec = decipher.update(encrypted.content, 'hex', 'utf8')
		dec += decipher.final('utf8');
		return dec;
	}
}