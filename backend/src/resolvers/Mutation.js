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
  async deleteItem(parent, args, ctx, info) {
    const { where } = args;
    // 1. Find the item
    const item = await ctx.db.query.item({ where }, '{ id title }');
    // 2. Check if they own that item, or have the permissions
    // TODO
    // 3. Delete it
    return ctx.db.mutation.deleteItem({ where }, info);
  },
};

module.exports = Mutations;
