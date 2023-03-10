const { NotFound, Conflict } = require('http-errors');
const uniqid = require('uniqid');
const { createEmailMarkup } = require('../../helpers');

require('dotenv').config();

const { User } = require('../../models');
const { sendEmail } = require('../../helpers');

const resendVerifyUserEmail = async (req, res) => {
  const { email } = req.body;
  // Create verificationToken user
  const verificationToken = uniqid();
  const user = await User.findOneAndUpdate(
    req.body,
    { verificationToken },
    {
      new: true,
      runValidators: true,
    }
  );

  // Checking if user appear
  if (!user) {
    throw new NotFound(`User with ${email} not found`);
  }

  // Checking if user already exist
  if (user.verify) {
    throw new Conflict(`User with email - ${email}, already verified`);
  }

  // Send email for verification
  const mail = {
    to: email,
    subject: 'Verification email',
    text: `Please, confirm your email: https://jekiekolya.github.io/wallet-leopards-team-FRONTEND/signUp/verify/${verificationToken}`,
    html: createEmailMarkup(verificationToken),
  };
  await sendEmail(mail);

  res.status(200).json({
    status: 'success',
    code: 200,
    data: {
      user: {
        email,
        verificationToken,
      },
      message: `A verification letter was sent to the email - ${email}`,
    },
  });
};

module.exports = resendVerifyUserEmail;
