const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: check if they are logged in

    const item = await ctx.db.mutation.createItem({
      data: { ...args.data },
    }, info);
    return item;
  },
};

module.exports = Mutations;
