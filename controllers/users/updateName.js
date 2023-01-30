const { User } = require('../../models');

const updateName = async (req, res) => {
  const { _id, email } = req.user;

  const user = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    code: 200,
    data: {
      user: {
        _id,
        email,
        firstName: user.firstName,
      },
    },
  });
};

module.exports = updateName;
