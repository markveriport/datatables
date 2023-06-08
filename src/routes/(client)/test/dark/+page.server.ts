import * as fs from 'fs'

export const load = async () => {
<<<<<<< HEAD:src/routes/test/+page.server.ts
    const path = './src/routes'
    const lib = './src/lib'
    const page = 'test'
=======
    const path = './src/routes/test'
    const lib = './src/lib'
    const page = 'dark'
>>>>>>> upstream/master:src/routes/(client)/test/dark/+page.server.ts
    return {
        dataset: fs.readFileSync(`./src/data/test.ts`).toString('utf-8'),
        components: [
            {
                name: 'Main.svelte',
                code: fs.readFileSync(`${path}/${page}/Main.svelte`).toString('utf-8'),
                components: [
                    {
                        name: 'Th.svelte',
                        code: fs.readFileSync(`${lib}/Th.svelte`).toString('utf-8')
                    },
                    {
                        name: 'ThFilter.svelte',
                        code: fs.readFileSync(`${lib}/ThFilter.svelte`).toString('utf-8')
                    },
                    {
                        name: 'Datatable.svelte',
                        code: fs.readFileSync(`${lib}/Datatable.svelte`).toString('utf-8'),
                        components: [
                            {
                                name: 'Search.svelte',
                                code: fs.readFileSync(`${lib}/Search.svelte`).toString('utf-8')
                            },
                            {
                                name: 'RowsPerPage.svelte',
                                code: fs.readFileSync(`${lib}/RowsPerPage.svelte`).toString('utf-8')
                            },
                            {
                                name: 'RowCount.svelte',
                                code: fs.readFileSync(`${lib}/RowCount.svelte`).toString('utf-8')
                            },
                            {
                                name: 'Pagination.svelte',
                                code: fs.readFileSync(`${lib}/Pagination.svelte`).toString('utf-8')
                            }
                        ]
                    }
                ]
            }
        ]
    }
}
