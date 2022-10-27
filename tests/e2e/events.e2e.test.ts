import axios from "axios";

const domain = 'http://localhost:3000'; //make sure to update with porper domain
const resource = '/events';

describe("/events", () => {
    it("POST /events with success", async () => {
        const body = [
            {
                "name": "blue",
                "amount": 123,
                "size": "small"
            },
                {
                "name": "green",
                "amount": 5643,
                "size": "medium"
            }
        ];
        const response = await axios.post(
            domain + resource, 
            body,
            {
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                },
            },
        );
        
        expect(response.status).toEqual(200);
        expect(response.data["failedCount"]).toEqual(0);
    });

    it("GET /events with success", async () => {
        const response = await axios.get( domain + resource);

        expect(response.status).toEqual(200);
        expect(response.data["data"]).toEqual(          
            expect.arrayContaining([
                expect.objectContaining({"name": "blue", "amount": 123, "size": "small"}),
                expect.objectContaining({"name": "green", "amount": 5643, "size": "medium"}),
            ])
        )
    });
});