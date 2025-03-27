import { ApiResponse, Pet, Order, User } from "./generated-schemas";
import { z } from "zod";

export const resources = {
  uploadFile: {
    path: "/pet/{petId}/uploadImage",
    method: "post",
    params: {
      path: {
        petId: z.number().int(),
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
        status: z.array(
          z.enum(["available", "pending", "sold"]).default("available"),
        ),
      },
    },
    responseType: z.array(Pet),
  },
  findPetsByTags: {
    path: "/pet/findByTags",
    method: "get",
    params: {
      query: {
        tags: z.array(z.string()),
      },
    },
    responseType: z.array(Pet),
  },
  getPetById: {
    path: "/pet/{petId}",
    method: "get",
    params: {
      path: {
        petId: z.number().int(),
      },
    },
    responseType: Pet,
  },
  updatePetWithForm: {
    path: "/pet/{petId}",
    method: "post",
    params: {
      path: {
        petId: z.number().int(),
      },
    },
  },
  deletePet: {
    path: "/pet/{petId}",
    method: "delete",
    params: {
      path: {
        petId: z.number().int(),
      },
    },
  },
  getInventory: {
    path: "/store/inventory",
    method: "get",
    params: {},
    responseType: z.record(z.number().int()),
  },
  placeOrder: {
    path: "/store/order",
    method: "post",
    params: {
      body: Order,
    },
    responseType: Order,
  },
  getOrderById: {
    path: "/store/order/{orderId}",
    method: "get",
    params: {
      path: {
        orderId: z.number().int().gte(1).lte(10),
      },
    },
    responseType: Order,
  },
  deleteOrder: {
    path: "/store/order/{orderId}",
    method: "delete",
    params: {
      path: {
        orderId: z.number().int().gte(1),
      },
    },
  },
  createUsersWithListInput: {
    path: "/user/createWithList",
    method: "post",
    params: {
      body: z.array(User),
    },
  },
  getUserByName: {
    path: "/user/{username}",
    method: "get",
    params: {
      path: {
        username: z.string(),
      },
    },
    responseType: User,
  },
  updateUser: {
    path: "/user/{username}",
    method: "put",
    params: {
      path: {
        username: z.string(),
      },
      body: User,
    },
  },
  deleteUser: {
    path: "/user/{username}",
    method: "delete",
    params: {
      path: {
        username: z.string(),
      },
    },
  },
  loginUser: {
    path: "/user/login",
    method: "get",
    params: {
      query: {
        username: z.string(),
        password: z.string(),
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
  createUser: {
    path: "/user",
    method: "post",
    params: {
      body: User,
    },
  },
};
