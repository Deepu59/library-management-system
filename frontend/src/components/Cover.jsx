const COLORS = ['#14213D', '#1F6F6A', '#8F2F20', '#2D4A7A', '#9A6A00'];

export default function Cover({ title, url, big }) {
  const cls = big ? 'cover big' : 'cover';
  if (url) return <img className={cls} src={url} alt="" />;
  const color = COLORS[title.length % COLORS.length];
  return (
    <div className={cls} style={{ background: color }} aria-hidden="true">
      {title}
    </div>
  );
}