import React, { useState, useEffect, useMemo } from 'react'
import TableFilterComboBox from './index';
import { useTable } from 'react-table'
import loadData from '../../services/loadData';

export default {
  title: 'Misc/Table Filter Combo Box',
};

export const mock = () => (
  <TableFilterComboBox options={{
    food: ['bread', 'egg', 'lettuce', 'tomato'],
    drinks: ['water', 'soda', 'milk'],
  }} />
);

function flattenRecursive(data, prefix = [], result = {}) {
  if (Object(data) !== data) {
    if (data) {
      result[prefix.join('.')] = data
    }
    return result
  } else {
    Object.keys(data).forEach((key) => {
      flattenRecursive(data[key], [...prefix, key], result)
    })
    return result
  }
}

const CellDefault = ({value}) => <pre>{JSON.stringify(flattenRecursive(value), null, 2)}</pre>
// const CellDefault = ({value}) => <span>NA</span>

export const Phenotype = () => {
  const [data, setData] = useState([])
  const wbId = 'WBGene00015146'
  const tableType = 'phenotype_flat'

  useEffect(() => {
    loadData(wbId, tableType).then((json) => {
      setData(json.data)
    })
  }, [wbId, tableType])

  const attributeKeysAll = []
  console.log(flattenRecursive({a: 1}));
  console.log(flattenRecursive({a: [2, 4]}));
  console.log(flattenRecursive({a: [2, null]}));
  console.log(data[0]);
  console.log(flattenRecursive(data[0]));

  const options = useMemo(() => {
    return data.reduce((result, item) => {
      const itemflat = flattenRecursive(item)
      Object.keys(itemflat).forEach((key, i) => {
        if (!result[key]) {
          result[key] = ['(Empty)']
        }
        if (result[key].indexOf(itemflat[key]) === -1) {
          result[key].push(itemflat[key])
        }
      })
      return result;
    }, {})
  }, [data])

  console.log(options);

  const columns = useMemo(() => ([
    {accessor: 'phenotype', Header: 'phenotype', Cell: CellDefault},
    {accessor: 'entity', Header: 'entity', Cell: CellDefault},
    {accessor: 'evidence', Header: 'evidence', Cell: CellDefault},
  ]), [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data })

  return (
    <div>
      <TableFilterComboBox options={options} />
      <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
       <thead>
         {headerGroups.map(headerGroup => (
           <tr {...headerGroup.getHeaderGroupProps()}>
             {headerGroup.headers.map(column => (
               <th
                 {...column.getHeaderProps()}
                 style={{
                   borderBottom: 'solid 3px red',
                   background: 'aliceblue',
                   color: 'black',
                   fontWeight: 'bold',
                 }}
               >
                 {column.render('Header')}
               </th>
             ))}
           </tr>
         ))}
       </thead>
       <tbody {...getTableBodyProps()}>
         {rows.map(row => {
           prepareRow(row)
           return (
             <tr {...row.getRowProps()}>
               {row.cells.map(cell => {
                 return (
                   <td
                     {...cell.getCellProps()}
                     style={{
                       padding: '10px',
                       border: 'solid 1px gray',
                       background: 'papayawhip',
                     }}
                   >
                     {cell.render('Cell')}
                   </td>
                 )
               })}
             </tr>
           )
         })}
       </tbody>
      </table>
    </div>
  )
}
