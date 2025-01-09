import { NotificationManager } from 'react-notifications';

class _ShowAlert {
	info({ title='Информация', message, time }) {
		NotificationManager.info(message, title, time);
	};
	success({ title='Успешно!', message, time }) {
		NotificationManager.success(message, title, time);
	};
	warning({ title='Внимание!', message, time }) {
		NotificationManager.warning(message, title, time);
	};
	error({ title='Ошибка', message, time }) {
		NotificationManager.error(message, title, time);
	};
};

export const ShowAlert = new _ShowAlert();