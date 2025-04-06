const CHAPA_AUTH=process.env.CHAPA_AUTH
const config = {
    headers: {
        Authorization: `Bearer ${CHAPA_AUTH}`
    }
}
 export {config};