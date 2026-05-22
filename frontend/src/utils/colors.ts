export const getColorByType = (type: string): string => {
  const colorByType: Record<string, string> = {
    info:    '#3b97e3',
    error:   '#FF5C5C',
    danger:  '#FF5C5C',
    delete:  '#FF5C5C',
    
    edit:    '#F37913',
    logout:  '#F37913',
    warning: '#F37913',
    
    'error-database': '#3b97e3',
  };

  return colorByType[type] ?? '#5da271';
};
