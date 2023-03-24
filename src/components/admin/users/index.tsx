import styles from './index.module.scss';
import UsersList from './list';

const Users = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.subtitle}>Users</div>
        <UsersList />
      </div>
    </div>
  );
};
export default Users;
