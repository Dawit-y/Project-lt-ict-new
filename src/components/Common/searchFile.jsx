export const handleSearchData = ({ setState, data, item }) => {
    setState(data.filter((search) =>
        Object.values(search).some(
            (field) =>
                typeof field === 'string' &&
                field?.toLowerCase().includes(item?.toLowerCase()),
        )
    ))
}