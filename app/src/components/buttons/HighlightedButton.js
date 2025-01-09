import { MyButton } from "./MyButton";
import { COLORS } from "../Colors";

export const HighlightedButton = ({ type = "button", ...props }) => {
    return (
        <MyButton
            {...props}
            style={{
                backgroundColor: COLORS.highlight, // Ваш цвет
                color: COLORS.text, // Цвет текста
                border: 'none', // Убираем границы
                ...props.style, // Если есть дополнительные стили
            }}
            variant="" // Пустая строка вместо null
            shadowColor={COLORS.highlight}
            type={type} // Используем переданный или значение по умолчанию
        />
    );
};
