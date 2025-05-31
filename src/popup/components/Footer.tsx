export default function Footer() {
  return (
    <div className="bg-[#0F1629] rounded-[8px] flex items-center gap-4 p-[16px] justify-center">
      <img src="/img/warning.png" alt="Warning" />
      <span className="text-sm text-white">
        Our extension and docs are still under development, any feedback contact
        us at
        <a
          href="https://discord.com/invite/sherry"
          target="_blank"
          rel="noreferrer"
          className="text-[#B81058]"
        >
          {' '}
          Discord.
        </a>
      </span>
    </div>
  );
}
