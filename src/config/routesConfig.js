// List of user routes where Header and Footer should be displayed
export const userRoutesToCheck = [
    "/",
    "/home",
    "/about",
    "/contact",
    "/jobs",
    /^\/jobs\/[\w-]+?$/,
    "/jobs/listed-jobs",
    /^\/jobs\/listed-jobs\/[\w-]+?$/,
    "/jobs/works-history",
    "/laborers",
    /^\/laborers\/[\w-]+?$/,
    "/laborer-profile",
    "/become-laborer-form",
    "/account",
    "/profile",
    "/edit-profile",
    "/manage-subscription",
    "/notifications",
    /^\/notifications\/[\w-]+?$/,
    /^\/chat\/[\w-]+\/[\w-]+$/
];

// List of admin routes where Header and Footer should be displayed
export const adminRoutesToCheck = [
    "/admin",
    "/admin/",
    "/admin/dashboard",
    "/admin/users",
    /^\/admin\/users\/[\w-]+\/?$/,
    "/admin/laborer-requests",
    /^\/admin\/laborer-requests\/view-request-details\/[\w-]+\/?$/,
    "/admin/subscription-plans",
    "/admin/subscription-plans/add-plan",
    /^\/admin\/subscription-plans\/edit-plan\/([\w-]+)\/?$/,
    "/admin/subscriptions",
    "/admin/banners",
    "/admin/banners/add-banner",
    /^\/admin\/banners\/edit-banner\/[\w-]+?$/,
    "/admin/notifications",
    /^\/admin\/notifications\/[\w-]+?$/,
];
