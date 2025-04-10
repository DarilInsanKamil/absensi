export async function kelasConverter(kelasId: number) {
    switch (kelasId) {
        case 4:
            return "X Broadcast 1"
            break;
        case 5:
            return "X DKV 1"
            break;
        case 9:
            return "X Broadcast 2"
            break;
        case 10:
            return "X DKV 2"
            break;
        case 14:
            return "X Broadcast 3"
            break;
        case 15:
            return "X DKV 3"
            break;
        default:
            break;
    }
}