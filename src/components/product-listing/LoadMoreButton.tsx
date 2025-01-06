type LoadMoreButtonProps = {
  onClick: () => void
}

export const LoadMoreButton = (props: LoadMoreButtonProps) => {
  return (
    <div className="mx-auto pb-16 bg-transparent text-gray-700 w-full">
      <p className="flex justify-center">
        <button
          role="button"
          onClick={props.onClick}
          className="flex items-center h-12 border border-black bg-transparent px-[25px] cursor-pointer hover:underline hover:underline-offset-2"
        >
          <span className="text-black text-center font-abchanel font-semibold text-xs leading-[14px] cursor-pointer">
            View More Products
          </span>
        </button>
      </p>
    </div>
  )
}
