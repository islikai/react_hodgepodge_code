import cx from 'classnames';
import * as styles from './index.module.less';

interface BoxPanelProps {
  className?: string;
  children?: React.ReactNode;
}

export const BoxPanel: React.FC<BoxPanelProps> = (({
  className,
  children
}) => {
  return (
    <div className={cx(className, styles.boxPanel)}>
      {children}
    </div>
  )
});

export default BoxPanel;
