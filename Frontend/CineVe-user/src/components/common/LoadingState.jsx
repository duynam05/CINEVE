function LoadingState({ text = "Đang tải dữ liệu..." }) {
  return <div className="empty-state"><p>{text}</p></div>;
}

export default LoadingState;
