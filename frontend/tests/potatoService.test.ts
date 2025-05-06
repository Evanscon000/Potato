import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import axios from "axios";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import {
    PotatoItem,
    createPotatoItem,
    getAllPotatoes,
    getPotatoById,
    updatePotatoItem,
    deletePotatoItem,
} from "../src/services/potatoService";

// points axios at the same origin Vite serves from during tests
axios.defaults.baseURL = "http://localhost:3000";

// mock server setup
const server = setupServer();
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

// object reused in tests
const dummy: PotatoItem = {
    id: 1,
    name: "Connor",
    hourlyPay: 40,
    hoursPerWeek: 50,
    potatoPriceAtConversion: 1.5,
};

describe("potatoService CRUD", () => {
    it("creates a potato (POST)", async () => {
        server.use(
            http.post("api/potatoes", async ({ request }) => {
                const body = (await request.json()) as PotatoItem;
                return HttpResponse.json({ ...body, id: 1 }, { status: 201 });
            }),
        );
        const result = await createPotatoItem({ ...dummy, id: undefined });
        expect(result).toStrictEqual(dummy);
    });

    it("gets all potatoes (GET)", async () => {
        server.use(
            http.get("api/potatoes", () =>
                HttpResponse.json([dummy], { status: 200 }),
            ),
        );
        const result = await getAllPotatoes();
        expect(result).toStrictEqual([dummy]);
    });

    it("gets potato by id (GET /{id})", async () => {
        server.use(
            http.get("api/potatoes/1", () => HttpResponse.json(dummy, { status: 200 })),
        );
        const result = await getPotatoById(1);
        expect(result).toStrictEqual(dummy);
    });

    it("updates a potato (PUT /{id})", async () => {
        const updated = { ...dummy, hourlyPay: 55 };
        server.use(
            http.put("api/potatoes/1", async ({ request }) => {
                const body = await request.json();
                return HttpResponse.json(body, { status: 200 });
            }),
        );
        const result = await updatePotatoItem(1, updated);
        expect(result).toStrictEqual(updated);
    });

    it("deletes a potato (DELETE /{id})", async () => {
        server.use(
            http.delete("api/potatoes/1", () => HttpResponse.json({}, { status: 204 })),
        );
        const result = await deletePotatoItem(1);
        expect(result).toBe("item deleted");
    });
});
