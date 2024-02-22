export const loginAction = () => ({
  type: 'LOG_IN',
});

export const logoutAction = () => ({
  type: 'LOG_OUT',
});

export const adminPermissionAction = () => ({
  type: 'admin',
});

export const modPermissionAction = () => ({
  type: 'mod',
});

export const userPermissionAction = () => ({
  type: 'user',
});

export const clearPermissionAction = () => ({
  type: 'empty',
});
