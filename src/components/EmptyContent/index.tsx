import { Empty, EmptyProps } from 'antd';

export const EmptyContent: React.FC<EmptyProps> = ((props) => {
  return (
    <Empty
      image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
      imageStyle={{ height: 60 }}
      description={
        <span>
          无数据
        </span>
      }
      {...props}
    >
    </Empty>
  )
});

export default EmptyContent;
