export default [
  {
    path: '/dataTable/basic',
    name: 'dtBasic',
    component: () => import('@/views/dataTable/DTBasic.vue'),
  },
  {
    path: '/dataTable/tooltip',
    name: 'dtTooltip',
    component: () => import('@/views/dataTable/DTTooltip.vue'),
  },
  {
    path: '/dataTable/filters',
    name: 'dtFilters',
    component: () => import('@/views/dataTable/DTFilters.vue'),
  },
  {
    path: '/dataTable/graphicCells',
    name: 'dtGraphicCells',
    component: () => import('@/views/dataTable/DTGraphicCell.vue'),
  },
  {
    path: '/dataTable/groups',
    name: 'dtGroups',
    component: () => import('@/views/dataTable/DTGroups.vue'),
  },
  {
    path: '/dataTable/pagination',
    name: 'dtPag',
    component: () => import('@/views/dataTable/DTPagination.vue'),
  },
  {
    path: '/dataTable/rowActions',
    name: 'dtRowActions',
    component: () => import('@/views/dataTable/DTRowActions.vue'),
  },
  {
    path: '/dataTable/rowSelection',
    name: 'dtRowSel',
    component: () => import('@/views/dataTable/DTRowSelection.vue'),
  },
  {
    path: '/dataTable/sorting',
    name: 'dtSort',
    component: () => import('@/views/dataTable/DTSort.vue'),
  },
   {
    path: '/dataTable/sortable-columns',
    name: 'dtSortableColumns',
    component: () => import('@/views/dataTable/DTSortableColumns.vue'),
  },
  {
    path: '/dataTable/totals',
    name: 'dtTotals',
    component: () => import('@/views/dataTable/DTTotal.vue'),
  },
  {
    path: '/dataTable/hide-repetition',
    name: 'dtRowsRepetition',
    component: () => import('@/views/dataTable/DTRowsRepetition.vue'),
  },
  {
    path: '/dataTable/button-cell',
    name: 'dtButtonCell',
    component: () => import('@/views/dataTable/DTJ4btn.vue'),
  },
  {
    path: '/dataTable/checkbox-cell',
    name: 'dtCheckboxCell',
    component: () => import('@/views/dataTable/DTCheckbox.vue'),
  },
  {
    path: '/dataTable/progressbar',
    name: 'dtProgressbar',
    component: () => import('@/views/dataTable/DTProgressbar.vue'),
  },
];
