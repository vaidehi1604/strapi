const sendInvitationEmail = async (firstName,email, role, inviteUrl) => {
    await strapi.plugins['email'].services.email.send({
      to: email,
      from: "vaidehi@example.com",
      subject: "Invitation to join our platform",
      html: `
            <p>Hello, ${firstName}</p>
            <p>You have been invited to join our platform as a ${role}. To accept the invitation, please click the link below:</p>
            <a href="${inviteUrl}">${inviteUrl}</a>
            <p>Thank you!</p>
          `,
    });
  };
  module.exports = {
    sendInvitationEmail,
  };