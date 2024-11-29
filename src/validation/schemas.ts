import Joi from 'joi';

export interface RegisterData {
  login: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  full_name?: string;
}

export interface LoginData {
  loginOrEmail: string;
  password: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface ResetPasswordData {
  password: string;
  passwordConfirmation: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  categories: string[];
  status: string;
  publishDate?: Date;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  categories?: string[];
  status?: string;
  publishDate?: Date;
}

export interface CreateCommentData {
  content: string;
  status?: string;
  parentCommentId?: number;
}

export interface UpdateCommentData {
  content?: string;
  status?: string;
  parentCommentId?: number;
}

export interface CreateCategoryData {
  title: string;
  description?: string;
}

export interface UpdateCategoryData {
  title?: string;
  description?: string;
}

export interface UpdateUserData {
  login?: string;
  password?: string;
  full_name?: string;
  email?: string;
  verified?: boolean;
  avatar?: string;
  role?: string;
}

export const registerSchema = Joi.object({
  login: Joi.string().min(4).max(20).required().messages({
    'string.min': 'Login must be at least 4 characters long.',
    'string.max': 'Login must be at most 20 characters long.',
    'any.required': 'Login is required.',
  }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long.',
      'string.pattern.base':
        'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
      'any.required': 'Password is required.',
    }),
  passwordConfirmation: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Password confirmation does not match password.',
      'any.required': 'Password confirmation is required.',
    }),
  full_name: Joi.string()
    .required()
    .pattern(
      /^[A-ZА-Я][a-zа-яё]+ [A-ZА-Я][a-zа-яё]+$/,
      'two words with initial uppercase letters',
    )
    .messages({
      'string.pattern.name':
        'Full name must consist of two words, each starting with a capital letter.',
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Email must be a valid email address.',
      'any.required': 'Email is required.',
    }),
});

export const loginSchema = Joi.object({
  loginOrEmail: Joi.string().required().messages({
    'any.required': 'login or email is required.',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required.',
  }),
});

export const passwordResetSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long.',
      'string.pattern.base':
        'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
      'any.required': 'Password is required.',
    }),
  passwordConfirmation: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Password confirmation does not match password.',
      'any.required': 'Password confirmation is required.',
    }),
})


export const createPostSchema = Joi.object({
  title: Joi.string().min(3).max(255).required().messages({
    'string.base': 'Title must be a string.',
    'string.empty': 'Title cannot be empty.',
    'string.min': 'Title must be at least 3 characters long.',
    'string.max': 'Title cannot exceed 255 characters.',
    'any.required': 'Title is required.',
  }),

  content: Joi.string().min(10).required().messages({
    'string.base': 'Content must be a string.',
    'string.empty': 'Content cannot be empty.',
    'string.min': 'Content must be at least 10 characters long.',
    'any.required': 'Content is required.',
  }),

  categories: Joi.array()
    .items(Joi.string().required())
    .required()
    .unique()
    .min(1)
    .optional()
    .messages({
      'array.base': 'Categories must be an array.',
      'array.min': 'At least one category is required.',
    }),

  status: Joi.string()
    .valid('active', 'inactive', 'locked')
    .required()
    .messages({
      'string.base': 'Status must be a string.',
      'any.empty': 'Status cannot be empty.',
      'any.required': 'Status is required.',
      'any.only': 'Status must be either active or inactive or locked.',
    }),

  publishDate: Joi.date()
    .default(() => new Date())
    .messages({
      'date.base': 'Publish date must be a valid date.',
    }),
});

export const updatePostShema = Joi.object({
  title: Joi.string().min(3).max(255).optional().messages({
    'string.base': 'Title must be a string.',
    'string.empty': 'Title cannot be empty.',
    'string.min': 'Title must be at least 3 characters long.',
    'string.max': 'Title cannot exceed 255 characters.',
  }),

  content: Joi.string().min(10).optional().messages({
    'string.base': 'Content must be a string.',
    'string.empty': 'Content cannot be empty.',
    'string.min': 'Content must be at least 10 characters long.',
  }),

  categories: Joi.array()
    .items(Joi.string().required())
    .required()
    .unique()
    .min(1)
    .optional()
    .messages({
      'array.base': 'Categories must be an array.',
      'array.min': 'At least one category is required.',
    }),

  status: Joi.string()
    .valid('active', 'inactive', 'locked')
    .optional()
    .messages({
      'string.base': 'Status must be a string.',
      'any.only': 'Status must be either active or inactive or locked.',
    }),

  publishDate: Joi.date().optional().messages({
    'date.base': 'Publish date must be a valid date.',
  }),
}).min(1);

export const createCommentDto = Joi.object({
  content: Joi.string().min(1).required().messages({
    'string.empty': 'Content is required',
    'any.required': 'Content is required',
  }),
  status: Joi.string().valid('active', 'inactive').optional(),
  parentCommentId: Joi.number().optional(),
});

export const updateCommentDto = Joi.object({
  content: Joi.string().min(1).optional().messages({
    'string.empty': 'Content cannot be empty',
  }),
  status: Joi.string().valid('active', 'inactive').optional(),
  parentCommentId: Joi.number().optional(),
});

export const createCategoryDto = Joi.object({
  title: Joi.string().min(1).required().messages({
    'string.empty': 'Title is required',
    'any.required': 'Title is required',
  }),
  description: Joi.string().min(1).optional().messages({
    'string.base': 'Description must be a string',
  }),
});

export const updateCategoryDto = Joi.object({
  title: Joi.string().min(1).optional().messages({
    'string.empty': 'Title is required',
  }),
  description: Joi.string().min(1).optional().messages({
    'string.base': 'Description must be a string',
  }),
}).min(1);

export const updateUserDto = Joi.object({
  login: Joi.string().min(4).max(20).messages({
    'string.min': 'Login must be at least 4 characters long.',
    'string.max': 'Login must be at most 20 characters long.',
  }),

  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
    .messages({
      'string.min': 'Password must be at least 8 characters long.',
      'string.pattern.base':
        'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
    }),

  full_name: Joi.string()
    .pattern(
      /^[A-ZА-Я][a-zа-яё]+ [A-ZА-Я][a-zа-яё]+$/,
      'two words with initial uppercase letters',
    )
    .messages({
      'string.pattern.name':
        'Full name must consist of two words, each starting with a capital letter.',
    }),

  email: Joi.string().email({ tlds: { allow: false } }).messages({
    'string.email': 'Email must be a valid email address.',
  }),

  verified: Joi.boolean().default(false),

  role: Joi.string().valid('admin', 'user').default('user').messages({
    'any.only': 'Role must be either admin or user.',
  }),
}).min(1);

