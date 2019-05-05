const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  // async items(parent, args, ctx, info) {
  //   const items = await ctx.db.query.items();
  //   return items;
  // },
  me(parent, args, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user({ where: { id: ctx.request.userId } }, info);
  },
  async users(parent, args, ctx, info) {
    // 1. check if they are logged in
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!');
    }
    // 2. check if the user has a permission to query all the users
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);
    // 3. if they do, query all the users!
    return ctx.db.query.users({}, info);
  },
  async order(parent, args, ctx, info) {
    // 1. Make sure they are logged in
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error('You must be logged in to do that!');
    }
    // 2. Query the current order
    const order = await ctx.db.query.order({ where: { id: args.id } }, info);
    // 3. Check if they have the permissions to see this order
    const ownsOrder = order.user.id === userId;
    const hasPermissionToSeeOrder = ctx.request.user.permissions.includes('ADMIN');
    if (!ownsOrder && !hasPermissionToSeeOrder) {
      throw new Error('You don\'t have permission to do that!');
    }
    // 4. Return the order
    return order;
  },
  async orders(parent, args, ctx, info) {
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error('You must be logged in to do that!');
    }
    return ctx.db.query.orders({ where: { user: { id: userId } }, orderBy: args.orderBy }, info);
  },
};

module.exports = Query;
