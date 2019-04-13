const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    // Hash their password
    const password = await bcrypt.hash(args.password, 10);
    // create the user in the database
    const user = await ctx.db.mutation.createUser({
      data: {
        ...args,
        password,
        permissions: { set: ['USER'] },
      },
    }, info);
    // create the JWT token for them
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // We set the JWT as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });
    // return the user to the browser
    return user;
  },
};

module.exports = Mutations;
