import numpy as np
from matplotlib import pyplot as plt

def plot_drawdown():

    t,ch = np.genfromtxt(r'tutorial2.ob_gw_out_head.csv', skip_header=1, delimiter=',').T
    f,ax = plt.subplots(1,1)
    ax.plot(t[1:],-(ch[1:]-ch[0]),'k.')
    ax.set_xlabel('time [s]')
    ax.set_ylabel('model drawdown [m]')
    ax.set_xscale('log')
    plt.show()
    
def main():
    plot_drawdown()
    
if __name__ == "__main__":
    main()