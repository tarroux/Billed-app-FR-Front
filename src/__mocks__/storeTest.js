// const mockStore = {
//     bills: jest.fn(() => ({
//         create: jest.fn(() => {
//             return Promise.resolve({
//                 fileUrl: "https://test.com/image.png",
//                 key: "1234",
//             });
//         }),
//         update: jest.fn(),
//     })),
// };

// export default mockStore;
const mockStore = {
    bills: jest.fn(() => ({
        create: jest.fn(() => {
            return Promise.resolve({
                fileUrl: "https://test.com/image.png",
                key: "1234",
            });
        }),
        update: jest.fn(() => {
            return Promise.resolve();
        }),
    })),
};

export default mockStore;