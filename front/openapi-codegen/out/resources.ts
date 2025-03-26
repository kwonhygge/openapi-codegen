import { Pet, ApiResponse, Order, User } from "./generated-schemas";
import { z } from "zod";

export const resources = {
  getPetById: {
    path: "/pet/{petId}",
    method: "get",
    params: {
      path: {
        petId: z.number().int().describe("ID of pet to return"),
      },
    },
    responseType: Pet,
  },
  updatePetWithForm: {
    path: "/pet/{petId}",
    method: "post",
    params: {
      path: {
        petId: z.number().int().describe("ID of pet that needs to be updated"),
      },
    },
  },
  deletePet: {
    path: "/pet/{petId}",
    method: "delete",
    params: {
      path: {
        petId: z.number().int().describe("Pet id to delete"),
      },
    },
  },
  uploadFile: {
    path: "/pet/{petId}/uploadImage",
    method: "post",
    params: {
      path: {
        petId: z.number().int().describe("ID of pet to update"),
      },
    },
    responseType: ApiResponse,
  },
  addPet: {
    path: "/pet",
    method: "post",
    params: {
      body: Pet,
    },
  },
  updatePet: {
    path: "/pet",
    method: "put",
    params: {
      body: Pet,
    },
  },
  findPetsByStatus: {
    path: "/pet/findByStatus",
    method: "get",
    params: {
      query: {
        status: z
          .array(z.enum(["available", "pending", "sold"]).default("available"))
          .describe("Status values that need to be considered for filter"),
      },
    },
    responseType: z.array(Pet),
  },
  findPetsByTags: {
    path: "/pet/findByTags",
    method: "get",
    params: {
      query: {
        tags: z.array(z.string()).describe("Tags to filter by"),
      },
    },
    responseType: z.array(Pet),
  },
  getInventory: {
    path: "/store/inventory",
    method: "get",
    params: {},
    responseType: z.record(z.number().int()),
  },
  getOrderById: {
    path: "/store/order/{orderId}",
    method: "get",
    params: {
      path: {
        orderId: z
          .number()
          .int()
          .gte(1)
          .lte(10)
          .describe("ID of pet that needs to be fetched"),
      },
    },
    responseType: Order,
  },
  deleteOrder: {
    path: "/store/order/{orderId}",
    method: "delete",
    params: {
      path: {
        orderId: z
          .number()
          .int()
          .gte(1)
          .describe("ID of the order that needs to be deleted"),
      },
    },
  },
  placeOrder: {
    path: "/store/order",
    method: "post",
    params: {
      body: Order,
    },
    responseType: Order,
  },
  getUserByName: {
    path: "/user/{username}",
    method: "get",
    params: {
      path: {
        username: z
          .string()
          .describe(
            "The name that needs to be fetched. Use user1 for testing. ",
          ),
      },
    },
    responseType: User,
  },
  updateUser: {
    path: "/user/{username}",
    method: "put",
    params: {
      path: {
        username: z.string().describe("name that need to be updated"),
      },
      body: User,
    },
  },
  deleteUser: {
    path: "/user/{username}",
    method: "delete",
    params: {
      path: {
        username: z.string().describe("The name that needs to be deleted"),
      },
    },
  },
  createUser: {
    path: "/user",
    method: "post",
    params: {
      body: User,
    },
  },
  createUsersWithListInput: {
    path: "/user/createWithList",
    method: "post",
    params: {
      body: z.array(User),
    },
  },
  loginUser: {
    path: "/user/login",
    method: "get",
    params: {
      query: {
        username: z.string().describe("The user name for login"),
        password: z.string().describe("The password for login in clear text"),
      },
    },
    responseType: z.string(),
  },
  logoutUser: {
    path: "/user/logout",
    method: "get",
    params: {},
  },
  createUsersWithArrayInput: {
    path: "/user/createWithArray",
    method: "post",
    params: {
      body: z.array(User),
    },
  },
};
