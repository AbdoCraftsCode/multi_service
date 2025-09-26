export const vervicaionemailtemplet = ({ code } = {}) => {

    return `
    <p>Hello,</p>
    <p>Your secure authentication code is: <strong>${code}</strong></p>
    <p>If you didn’t request this, please ignore this email.</p>
`

}