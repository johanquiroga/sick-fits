const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: check if they are logged in

    const item = await ctx.db.mutation.createItem({
      data: { ...args.data },
    }, info);
    return item;
  },
  async updateItem(parent, args, ctx, info) {
    // first tale a copy of the updates
    const updates = { ...args.data };
    // remove the ID from the updates
    delete updates.id;
    // run the update method
    return ctx.db.mutation.updateItem({ data: updates, where: { id: args.data.id } }, info);
  },
};

module.exports = Mutations;
