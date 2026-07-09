export const getPaginationOptions = (query: any) => {
  const page = parseInt(query.page as string, 10) || 1;
  const limit = parseInt(query.limit as string, 10) || 20;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const formatPaginationResult = (page: number, limit: number, total: number) => {
  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  };
};
