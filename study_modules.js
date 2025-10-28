
const study_modules = [
  {
    module: 'tcm',
    description: '',
    counts: {
      cells: 308048,
      patients: 324,
      samples: 486,
      organs: 21,
      cancers: 16,
    },
    link: {
      css_class: 'orange',
      icon: 'bi-cash-stack',
      title: '> T cell map',
      link: '/TCM',
      description: '&nbsp;&nbsp;'
    }
  },
  {
    module: 'gastric_cancer',
    description: '',
    counts: {
      cells: 0,
      patients: 0,
      samples: 0,
      organs: 0,
      cancers: 0,
    },
    link: {
      css_class: 'purple',
      icon: 'bi-calendar4-week',
      title: '>Gastric cancer',
      link: '/GastricCancer',
      description: '&nbsp;&nbsp;'
    }
  },
  {
    module: 'gastric_tme',
    description: '',
    counts: {
      cells: 0,
      patients: 0,
      samples: 0,
      organs: 0,
      cancers: 0,
    },
    link: {
      css_class: 'green',
      icon: 'bi-chat-text',
      title: '>Gastric TME',
      link: '/GastricTME',
      description: '&nbsp;&nbsp;',
    }
  },
  {
    module: 'bcell_lc',
    description: '',
    counts: {
      cells: 0,
      patients: 0,
      samples: 0,
      organs: 0,
      cancers: 0,
    },
    link: {
      css_class: 'blue',
      icon: 'bi-folder2',
      title: '>B Cell Landscape in Lung Cancer',
      link: '/BcellLC',
      description: '&nbsp;&nbsp;',
    }
  },
  {
    module: 'ovarian_mrd',
    description: '',
    counts: {
      cells: 88701,
      patients: 1,
      samples: 8,
      organs: 1,
      cancers: 1,
    },
    link: {
      css_class: 'red',
      icon: 'bi-activity',
      title: '>Ovarian MRD',
      link: '/OvarianMRD',
      description: '&nbsp;&nbsp;',
    }
  },
];

module.exports = study_modules;
