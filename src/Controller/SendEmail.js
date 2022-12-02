import aws from 'aws-sdk';

const creds = new aws.Credentials;
creds.accessKeyId = "AKIAUWISRVHVMPQMFTVV";
creds.secretAccessKey = "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";
aws.config.credentials = creds;
const ses = new aws.SES({region: "us-east-2"});

export async function sendAdminTicketEmail(message, ticketNumber, sourceEmail) {
    const params = {
        Destination: {
            ToAddresses: ['jaggerhuff@gmail.com']
        },
        Message: {
            Body: {
                Text: {
                    Data: `Ticket #${ticketNumber} has been created by user ${sourceEmail}.\n\n${message}`
                }
            },
            Subject: {
                Data: `PeerUp support ticket ${ticketNumber} created.`
            }
        },
        Source: "peeruptutor@gmail.com"
    };
    return ses.sendEmail(params).promise();
}

export async function sendEmailNotification(email) {
    const params = {
        Destination: {
            ToAddresses: [email]
        },
        Message: {
            Body: {
                Text: {
                    Data: "You have a new notification on PeerUp, login to view."
                }
            },
            Subject: {
                Data: "New notification on PeerUp"
            }
        },
        Source: "peeruptutor@gmail.com"
    };
    return ses.sendEmail(params).promise();
}