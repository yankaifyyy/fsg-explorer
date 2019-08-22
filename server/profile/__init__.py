import datetime


def time_profile(identifier):
    def count_time(func):
        def int_time(*args, **kwargs):
            start_time = datetime.datetime.now()  # 程序开始时间
            func(*args, **kwargs)
            over_time = datetime.datetime.now()  # 程序结束时间
            total_time = (over_time - start_time).total_seconds()
            print(f'{identifier} cost {total_time} seconds')

        return int_time
    return count_time
