const SidebarMenuItem = ({Icon, title, active, onClick}) => {
  return (
    <div className="flex flex-row cursor-pointer animateHover items-center justify-center xl:justify-start text-xl space-x-3" onClick={onClick}>
        <Icon className='h-7 text-white' size={30} />
        <span className={`hidden xl:inline text-white ${active && 'font-bold'}`}>{title}</span>
    </div>
  )
}

export default SidebarMenuItem