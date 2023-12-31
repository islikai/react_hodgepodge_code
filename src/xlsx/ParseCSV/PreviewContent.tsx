import { useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import { Button, Form, Select, Space, Table, message } from 'antd';
import { generate } from 'shortid';
import CopyToClipboard from 'react-copy-to-clipboard';
import { BoxPanel } from '../../components/BoxPanel';
import { useMemoizedFn } from 'ahooks';
import * as styles from './index.module.less';

const MARK = 'specifications';

const getTotal = (data?: string[]) => {
  if (!data || !Array.isArray(data)) {
    return;
  }
  const result: number = data?.reduce((pre: number, cur: string) => {
    if (cur?.includes('L')) {
      pre += parseFloat(cur) * 1000;
    } else if (cur?.includes('ml')) {
      pre += parseFloat(cur);
    }
    return pre;
  }, 0);
  return result / 1000
}

interface PreviewContentProps {
  className?: string;
  data?: any;
}

export const PreviewContent: React.FC<PreviewContentProps> = (({
  className,
  data
}) => {
  const [cols, setCols] = useState<string[]>([]);
  const [renderCols, setRenderCols] = useState<string[]>([]);
  const [dataSource, setDataSource] = useState<any[]>();
  const [renderDataSource, setRenderDataSource] = useState<any[]>();
  const [generateValues, setGenerateValues] = useState<string[]>([]);

  const [form] = Form.useForm();

  const columns = useMemo(() => {
    return (renderCols?.length ? renderCols : cols)?.map((key) => {
      const isGenerateKey = key === MARK;
      return {
        fixed: (isGenerateKey ? 'right' : undefined) as any,
        title: key,
        dataIndex: key,
        key,
        render: (v: string) => {
          return (
            <div className={cx({ [styles.mark]: isGenerateKey })}>
              {v}
            </div>
          )
        }
      }
    })
  }, [renderCols, cols]);

  const generateKeys = useMemoizedFn(() => {
    form?.validateFields().then((values) => {
      setRenderCols([])
      setRenderDataSource([]);
      const newClos = data?.map((item: any) => {
        const str = item?.[values?.colKey];

        const pattern = /(\d+(?:[Lml]+))+/g;
        const specs = str.match(pattern);

        const total = getTotal(specs);

        return total ? `${total}L` : '';
      });
      const _list = dataSource?.map((item, index) => {
        return {
          ...item,
          [MARK]: newClos?.[index],
        }
      })
  
      setRenderCols([...cols, MARK])
      setRenderDataSource(_list);
      setGenerateValues(newClos);
    })
  })

  // const previewData = useMemoizedFn(() => {
  //   const _list = dataSource?.map((item, index) => {
  //     return {
  //       ...item,
  //       [MARK]: generateValues?.[index],
  //     }
  //   })
  //   console.log(_list);
  //   setCols([...cols, MARK])
  //   setDataSource(_list);
  // })

  useEffect(() => {
    const item = data?.[0] ?? {};
    const _cols = Object.keys(item);
    const _dataSource = data?.map((item: any) => {
      return {
        id: generate(),
        ...item,
      }
    })
    setCols(_cols);
    setDataSource(_dataSource);
  }, [data]);
  
  return (
    <>
      <BoxPanel>
        <Form
          form={form}
          layout='vertical'
        >
          <Form.Item
            label="选择要处理的表格列"
            name='colKey'
            rules={[{ required: true, message: '请选择要处理的表格列' }]}
          >
            <Select placeholder={'请选择要处理的表格列'}>
              {
                cols?.map(key => {
                  return (
                    <Select.Option key={key} value={key}>
                      {key}
                    </Select.Option>
                  )
                })
              }
            </Select>
          </Form.Item>
        </Form>
        <Space>
          <Button type='primary' onClick={generateKeys}>
            生成规格数据
          </Button>
          <Button type='primary'>
            <CopyToClipboard
              text={generateValues?.join("\n")}
              onCopy={() => message.success('复制成功')}
            >
              <span>
                复制生成数据
              </span>
            </CopyToClipboard>
          </Button>
          {/* <Button type='primary' onClick={previewData}>
            预览生成数据
          </Button> */}
        </Space>
      </BoxPanel>
      <BoxPanel>
        <Table
          size='small'
          columns={columns}
          dataSource={renderDataSource?.length ? renderDataSource : dataSource}
          rowKey={'id'}
          pagination={false}
          scroll={{ x: 1200, y: '50vh' }}
        />
      </BoxPanel>
    </>
  )
});
