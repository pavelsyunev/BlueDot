const Errors = ({errors}) => {
    return (
        <div className="flex top-32 w-11/12 rounded shadow-md bg-yellow-400 absolute z-50 m-6 p-4">
            <p><span className='font-bold'>Error: </span>{errors}</p>
        </div>
    )
}

export default Errors;