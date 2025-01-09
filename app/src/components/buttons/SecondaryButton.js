import { MyButton } from "./MyButton";
import { COLORS } from "../Colors";

export const SecondaryButton = ({ type = "button", ...props }) => {
    return (
        <MyButton
            {...props}
            style={{
                backgroundColor: COLORS.secondary, // Ваш цвет
                color: COLORS.text, // Цвет текста
                border: 'none', // Убираем границы
                ...props.style, // Если есть дополнительные стили
            }}
            variant="" // Пустая строка вместо null
            shadowColor={COLORS.secondary}
            type={type} // Используем переданный или значение по умолчанию
        />
    );
};
