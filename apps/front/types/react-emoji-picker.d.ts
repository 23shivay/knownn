declare module 'react-emoji-picker' {
    interface EmojiPickerProps {
      onEmojiClick: (emoji: string) => void;
    }
  
    const EmojiPicker: React.FC<EmojiPickerProps>;
    export default EmojiPicker;
  }
  