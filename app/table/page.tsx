"use client"
import { Table, TableCard } from '@/components/application/table/table'
import React from 'react'

const page = () => {
  return (
    <TableCard.Root>
        <TableCard.Header title='Product List' badge='100'/>
        <Table aria-label=''>
            {/* <Table.Header ='id'/> */}
            {/* <Table.Head label='name'/>
            <Table.Head label='image'/>
            <Table.Head label='qauntity'/>
            <Table.Head label='price'/>
            <Table.Head label='createAt'/> */}
        </Table>
    </TableCard.Root>
  )
}

export default page