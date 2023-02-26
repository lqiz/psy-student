import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({
	showSpinner: false,
});

export function bindGuards(router, cb) {
	router.beforeEach(async (to, from, next) => {
		NProgress.start();
		if (router.hasRoute(to.name)) {
			next();
		} else {
			next('/404');
		}
	});

	router.afterEach(() => {
		NProgress.done();
	});
}